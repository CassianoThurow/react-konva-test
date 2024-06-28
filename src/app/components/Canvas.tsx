'use client'

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Transformer } from 'react-konva';
import Konva from 'konva';

interface CanvasProps {
  elements: any[];
  setElements: React.Dispatch<React.SetStateAction<any[]>>;
  stageRef: React.RefObject<Konva.Stage>;
  animationStyles: string;
  renderElement: (node: any) => string;
  downloadHtml: (htmlContent: string, styles: string) => void;
  exportToHtml: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ elements, setElements, stageRef, animationStyles, renderElement, downloadHtml, exportToHtml }) => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const handleSelect = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const id = e.target.id();
    setSelectedShape(id);
  };

  useEffect(() => {
    if (trRef.current && selectedShape) {
      const node = stageRef.current?.findOne(`#${selectedShape}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer()?.batchDraw();
      } else {
        trRef.current.nodes([]);
      }
    }
  }, [selectedShape, stageRef]);

  useEffect(() => {
    if (stageRef.current) {
      const container = stageRef.current.container();
      container.tabIndex = 1;
      container.focus();
    }
  }, [stageRef]);

  const updateElement = (id: string, newAttrs: any) => {
    const updatedElements = elements.map((el) => {
      if (el.id === id) {
        return { ...el, attrs: { ...el.attrs, ...newAttrs } };
      }
      return el;
    });
    setElements(updatedElements);
  };

  const handleTransformEnd = (id: string, e: any, type: string) => {
    const node = e.target;
    let newAttrs = {
      x: node.x(),
      y: node.y(),
      scaleX: 1,
      scaleY: 1,
    };

    if (type === 'rect') {
      newAttrs = {
        ...newAttrs,
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
      };
    } else if (type === 'circle') {
      newAttrs = {
        ...newAttrs,
        radius: node.radius() * node.scaleX(),
      };
    }

    updateElement(id, newAttrs);
  };

  return (
    <div className="relative">
      <Stage
        width={window.innerWidth * 0.75}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedShape(null);
          }
        }}
      >
        <Layer>
          {elements.map((el) => {
            const isSelected = selectedShape === el.id;
            const shapeProps = {
              key: el.id,
              id: el.id,
              ...el.attrs,
              draggable: true,
              onClick: handleSelect,
              onDragEnd: (e: any) => {
                updateElement(el.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                });
              },
              onTransformEnd: (e: any) => handleTransformEnd(el.id, e, el.type),
            };

            switch (el.type) {
              case 'rect':
                return <Rect {...shapeProps} />;
              case 'circle':
                return <Circle {...shapeProps} />;
              case 'text':
                return <Text {...shapeProps} />;
              case 'image':
                return <KonvaImage {...shapeProps} />;
              default:
                return null;
            }
          })}
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
      <button 
        onClick={exportToHtml} 
        className="absolute top-0 left-0 m-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Export HTML
      </button>
    </div>
  );
};

export default Canvas;
