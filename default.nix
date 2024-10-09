
{
  runScript ? ''pnpm run tauri''
}:
let
  android-nixpkgs = pkgs.callPackage (import (builtins.fetchGit {
    url = "https://github.com/tadfisher/android-nixpkgs.git";
  })) {
    # Default; can also choose "beta", "preview", or "canary".
    channel = "stable";
  };

  android-sdk = android-nixpkgs.sdk (sdkPkgs: with sdkPkgs; [
    build-tools-34-0-0
    cmdline-tools-latest
    # emulator
    platform-tools
    platforms-android-34

    # Other useful packages for a development environment.
    ndk-26-1-10909125
    # skiaparser-3
    # sources-android-34
  ]);

  rust_overlay = import (builtins.fetchTarball "https://github.com/oxalica/rust-overlay/archive/master.tar.gz");
  pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/refs/tags/24.05.tar.gz") { 
    overlays = [ rust_overlay];
  };

  rustVersion = "1.79.0";
  rust = pkgs.rust-bin.stable.${rustVersion}.default.override {
    extensions = [
      "rust-src" # for rust-analyzer
      "rust-analyzer"
    ];
    targets = [
      "x86_64-pc-windows-gnu"
      "x86_64-pc-windows-gnullvm"
      "aarch64-linux-android"
      "armv7-linux-androideabi"
    ];
  };

  pkgConfigDeps = with pkgs; [
    gtk3
    glib
    cairo
    pango
    harfbuzz
    atk
    gdk-pixbuf
    webkitgtk_4_1
    librsvg
    libsoup_3
    openssl
  ];

  
  targetPkgs = pkgs: 
  [
    android-sdk
    rust
  ]++(with pkgs; [
    ell.dev
    clang
    nodePackages.pnpm
    rustup
    pkg-config
    zlib

    # cross-compilation
    pkgsCross.mingwW64.stdenv.cc
    gradle
    androidStudioPackages.stable
    jdk

    # language-servers
    emmet-language-server
    kotlin-language-server
    nodePackages.typescript-language-server
    vscode-langservers-extracted
  ]);

in
pkgs.buildFHSEnv {
  name = "tauri-env";
  runScript = runScript;

  targetPkgs = targetPkgs;

  profile = ''
    export CARGO_TARGET_X86_64_PC_WINDOWS_GNU_RUSTFLAGS="-L native=${pkgs.pkgsCross.mingwW64.windows.pthreads}/lib"
    export ANDROID_HOME=${android-sdk}/share/android-sdk
    export ANDROID_SDK_ROOT=${android-sdk}/share/android-sdk
    export NDK_HOME=${android-sdk}/share/android-sdk/ndk/26.1.10909125
    export JAVA_HOME=${pkgs.jdk.home}
    export HOSTNAME=tauri-dev-env

    export PKG_CONFIG_PATH="${
      builtins.concatStringsSep ":" (map (pkg: "${pkg.dev}/lib/pkgconfig") pkgConfigDeps)
    }"

  '';
}
