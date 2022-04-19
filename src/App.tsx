import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import map from "./map.jpg";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

type Point = {
  x: number;
  y: number;
  type: "land" | "height" | "area";
  z?: number;
};

//12.1969px ~~ 1m

const M = 12.1969;

const upLeft: Point = { x: 117, y: 97, type: "land" }; //up left
const upRight: Point = { x: 554, y: 12, type: "land" }; //up right

const land: Point[] = [
  upLeft,
  upRight,
  { x: 117, y: 97, type: "land" }, //up left
  { x: 554, y: 12, type: "land" }, //up right
  { x: 562, y: 229, type: "land" },
  { x: 421, y: 337, type: "land" },
  { x: 6, y: 489, type: "land" },
  { x: 92, y: 273, type: "land" },
  { x: 117, y: 97, type: "land" },
];

const area: Point[] = land.map((p) => ({ ...p, type: "area" }));

const heights: Point[] = [
  { x: 137, y: 120, z: 234.8, type: "height" },
  { x: 238, y: 107, z: 234, type: "height" },
  { x: 224, y: 186, z: 233.2, type: "height" },
  { x: 363, y: 83, z: 232.8, type: "height" },
  { x: 392, y: 137, type: "height", z: 231.6 },
  { x: 355, y: 153, type: "height", z: 232 },
  { x: 499, y: 52, type: "height", z: 232 },
  { x: 483, y: 103, type: "height", z: 231.4 },
  { x: 112, y: 235, type: "height", z: 233.6 },
  { x: 105, y: 288, type: "height", z: 232.8 },
  { x: 84, y: 361, type: "height", z: 232 },
  { x: 54, y: 447, type: "height", z: 231.1 },
  { x: 84, y: 445, type: "height", z: 231.1 },
  { x: 200, y: 370, type: "height", z: 231.3 },
  { x: 281, y: 367, type: "height", z: 230.8 },
  { x: 311, y: 300, type: "height", z: 231 },
  { x: 407, y: 299, type: "height", z: 230.3 },
  { x: 436, y: 219, type: "height", z: 230.7 },
  { x: 483, y: 157, type: "height", z: 230.5 },
  { x: 501, y: 223, type: "height", z: 230 },
  { x: 531, y: 189, type: "height", z: 230.3 },
  { x: 568, y: 154, type: "height", z: 229.34 },
];
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [points, setPoints] = useState<Point[]>(
    land.concat(heights).concat(area)
  );

  const [scale, setScale] = useState(1.54);
  const mounted = useRef(false);

  const [drawing, setDrawing] = useState(true);

  let landX = useRef<number | null>(null);
  let landY = useRef<number | null>(null);

  let areaX = useRef<number | null>(null);
  let areaY = useRef<number | null>(null);

  useEffect(() => {
    // function handleClick(event: MouseEvent) {
    //   console.log({ event });

    //   if (drawing) {
    //     // setPoints((points) =>
    //     //   points.concat({ x: event.clientX, y: event.clientY, type: "height" })
    //     // );
    //     // navigator.clipboard.writeText(
    //     //   `{x:${event.clientX}, y: ${event.clientY}, type: 'height', z: 230},`
    //     // );
    //   }
    // }

    function handleKeyDown(event: KeyboardEvent) {
      console.log({ event });
      if (event.key === "d") {
        setDrawing((x) => !x);
      }

      if (event.key === "=") {
        event.preventDefault();
        setScale((scale) => scale + 0.01);
      }

      if (event.key === "-") {
        event.preventDefault();
        setScale((scale) => scale - 0.01);
      }
    }

    // window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      canvas.style.width = WIDTH + "px";
      canvas.style.height = HEIGHT + "px";

      const s = window.devicePixelRatio;

      canvas.width = Math.floor(WIDTH * s);
      canvas.height = Math.floor(HEIGHT * s);

      ctx.scale(
        window.devicePixelRatio * scale,
        window.devicePixelRatio * scale
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const landPoints = points.filter((point) => point.type === "land");
      const areaPoints = points.filter((point) => point.type === "area");
      const heightPoints = points.filter((point) => point.type === "height");

      const drawLandPoint = (point: Point) => {
        ctx.beginPath();
        ctx.strokeStyle = "#000";

        if (landX.current && landY.current) {
          ctx.moveTo(landX.current, landY.current);
        }
        ctx.lineTo(point.x, point.y);

        landX.current = point.x;
        landY.current = point.y;

        ctx.stroke();
        ctx.closePath();
      };

      const drawAreaPoint = (point: Point) => {
        ctx.beginPath();
        ctx.strokeStyle = "#a00";

        const x = point.x * 1;
        const y = point.y * 1;
        if (areaX.current && areaY.current) {
          ctx.moveTo(areaX.current, areaY.current);
        }
        ctx.lineTo(x, y);

        areaX.current = x;
        areaY.current = y;

        // ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "#000";

        ctx.closePath();
      };

      const drawHeightPoint = (point: Point) => {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);

        ctx.stroke();
        ctx.closePath();

        ctx.font = "13px serif";
        ctx.fillText(
          String(point.z?.toFixed(1)) ?? "no height",
          point.x + 10,
          point.y + 10
        );
      };

      const drawWidth = () => {
        ctx.beginPath();

        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.moveTo(upLeft.x, upLeft.y - 5);
        ctx.lineTo(upRight.x, upRight.y - 5);

        ctx.fillText(
          String(
            Math.sqrt(
              Math.pow(upLeft.x - upRight.x, 2) +
                Math.pow(upLeft.y - upRight.y, 2)
            ).toFixed(2)
          ) +
            " px" +
            " " +
            `(18.25cm) (36.5m)`,
          (upRight.x + upLeft.x) / 2 - 80,
          (upLeft.y - upRight.y) / 2 - 10
        );
        ctx.stroke();
        ctx.closePath();
      };

      const reset = () => {
        ctx.moveTo(0, 0);
        ctx.fillStyle = "#000";
      };

      landPoints.map(drawLandPoint);
      reset();

      heightPoints.map(drawHeightPoint);
      reset();

      drawWidth();
      mounted.current = true;
    }

    console.log(points.filter((p) => p.type === "height"));
  }, [scale]);

  return (
    <Wrap>
      <Canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      <Scale>{scale.toFixed(2)}</Scale>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 21cm;
  height: 29.7cm;
  background: #fff;
  position: relative;
`;

const Scale = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  font: 14px, serif;
  color: white;
  padding: 4px 16px;
  @media print {
    display: none !important;
  }
`;

const Map = styled.img`
  position: absolute;

  top: -120px;
  left: -396px;
  opacity: 0.6;
`;

const Canvas = styled.canvas`
  background: transparent;
  display: block;
`;

export default App;
