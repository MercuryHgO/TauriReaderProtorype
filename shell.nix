{ pkgs ? import <nixpkgs> {}}:
let
  environment = import ./default.nix { 
    runScript = ''${pkgs.writeShellScriptBin "cp-shell" ''
      tmux new-session -d -t cp-shell

      tmux split-window -h -t cp-shell
      tmux split-window -v -t cp-shell:0.1
      tmux resize-pane -t cp-shell:0.1 -x 20%

      tmux send-keys -t cp-shell:0 'bash' C-m

      tmux send-keys -t cp-shell:0.0 'hx' C-m
      tmux send-keys -t cp-shell:0.1 'pnpm run tauri dev' C-m
      tmux send-keys -t cp-shell:0.2 'firefox --new-instance -P dev localhost:1420' C-m

      tmux attach-session -t cp-shell

      while tmux has-session -t cp-shell; do sleep 1; done
      exit
    ''}/bin/cp-shell'';
  };
in
environment.env
