import React, { useEffect, useRef, useState } from "react";
import "./index.css"
import { BrowserView, MobileView } from "react-device-detect";

interface MousePosition {
    x: number | null;
    y: number | null;
}

const useMousePosition = (): MousePosition => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ y: null , x: null});

    useEffect(() => {
      const updateMousePosition = (ev: MouseEvent) => {
        setMousePosition({ y: ev.clientY, x: ev.clientX });
      };

      window.addEventListener('mousemove', updateMousePosition);

      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
      };
    }, []);

    return mousePosition;
};

type Props = {
  children: React.ReactNode
}

const Picker: React.FC<Props>  = (props: Props) => {
  const [onHover, setOnHower] = useState(false);

  const mousePosition = useMousePosition();
  const bookRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getDistance = (rect: DOMRect): number => {
    const mouseY = mousePosition.y;
    const centerY = rect.top + rect.height / 2;

    return Math.sqrt((mouseY! - centerY) ** 2);
  };

  const handleTouchStart = (index: number) => {
    if ( bookRefs.current[index] ) {
      bookRefs.current[index].style.transform = "scale(1.5)";
    }
  }

  const handleTouchEnd = (index: number) => {
    if ( bookRefs.current[index] ) {
      bookRefs.current[index].style.transform = "scale(1)";
    }
  }

  const clonedChildren = React.Children.map(props.children, (child, index) => {
    if (React.isValidElement(child)) {
      const ref = (el: HTMLDivElement | null) => bookRefs.current[index] = el;
      const rect = bookRefs.current[index]?.getBoundingClientRect();

      let scale: number = 1;
      const distance = rect ? getDistance(rect) : Infinity;

      if (
        distance < 200 && onHover
      ) {
        scale = 1.5 - distance / 200; 
        scale = Math.min(Math.max(scale, 1),1.3); 
      }


      return (
        <>
          <BrowserView>
            <div 
              key={index} 
              ref={ref} 
              style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease'}}
            >
                {child}
            </div>
          </BrowserView>
          <MobileView>
            <div 
              key={index} 
              ref={ref} 
              style={{ transition: 'transform 0.1s ease'}}
              onTouchStart={() => handleTouchStart(index)}
              onTouchEnd={() => handleTouchEnd(index)}
            >
                {child}
            </div>
          </MobileView>
        </>
      );
    }
    return child;
  });

  return(
    <div 
      className="picker"
      onPointerEnter={ () => setOnHower(true)}
      onPointerLeave={ () => setOnHower(false)}
    >
      {clonedChildren}      
    </div>
  )
}

export default Picker
