'use client'

import React, { useState } from 'react';

interface ControlPanelProps {
  addElement: (element: any) => void;
  stageRef: React.RefObject<any>;
  updateElement: (id: string, newAttrs: any) => void;
  addAnimationStyle: (style: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ addElement, stageRef, updateElement, addAnimationStyle }) => {
  const [color, setColor] = useState<string>('#000000');
  const [textSize, setTextSize] = useState<number>(24);
  const [elementId, setElementId] = useState<number>(0);
  const [animationX, setAnimationX] = useState<number>(0);
  const [animationY, setAnimationY] = useState<number>(0);
  const [animationDuration, setAnimationDuration] = useState<number>(2);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleTextSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextSize(e.target.value ? parseInt(e.target.value, 10) : 24);
  };

  const handleAnimationXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationX(e.target.value ? parseInt(e.target.value, 10) : 0);
  };

  const handleAnimationYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationY(e.target.value ? parseInt(e.target.value, 10) : 0);
  };

  const handleAnimationDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimationDuration(e.target.value ? parseInt(e.target.value, 10) : 2);
  };

  const addRectangle = () => {
    const newRect = {
      id: `rect${elementId}`,
      type: 'rect',
      attrs: {
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        fill: color,
      },
    };
    setElementId(elementId + 1);
    addElement(newRect);
  };

  const addCircle = () => {
    const newCircle = {
      id: `circle${elementId}`,
      type: 'circle',
      attrs: {
        x: 150,
        y: 150,
        radius: 50,
        fill: color,
      },
    };
    setElementId(elementId + 1);
    addElement(newCircle);
  };

  const addText = () => {
    const newText = {
      id: `text${elementId}`,
      type: 'text',
      attrs: {
        x: 100,
        y: 100,
        text: 'New Text',
        fontSize: textSize,
        fill: color,
      },
    };
    setElementId(elementId + 1);
    addElement(newText);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      const newImage = {
        id: `image${elementId}`,
        type: 'image',
        attrs: {
          x: 100,
          y: 100,
          src: reader.result,
          width: 200,
          height: 200,
        },
      };
      setElementId(elementId + 1);
      addElement(newImage);
    };
    reader.readAsDataURL(file);
  };

  const animateElement = () => {
    if (stageRef.current) {
      const transformer = stageRef.current.findOne('Transformer');
      const selectedNode = transformer ? transformer.getNode() : null;
      console.log('Transformer: ', transformer); // Adicione esse log para verificar o transformador
      console.log('Selected Node: ', selectedNode); // Adicione esse log para verificar o nó selecionado
      if (selectedNode) {
        const id = selectedNode.id();
        const animationClass = `animate-${id}`;
        const animationStyle = `
          @keyframes move-${id} {
            0% { transform: translate(0, 0); }
            100% { transform: translate(${animationX}px, ${animationY}px); }
          }
          .${animationClass} {
            animation: move-${id} ${animationDuration}s forwards;
          }
        `;
        console.log(animationStyle); // Verifique se o estilo de animação é gerado corretamente
        addAnimationStyle(animationStyle);
        updateElement(id, { animationClass });
      }
    }
  };

  return (
    <div className="p-4 space-y-4 bg-gray-200">
      <div>
        <label className="block mb-2">Color</label>
        <input type="color" value={color} onChange={handleColorChange} className="w-full" />
      </div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={addRectangle}>
        Add Rectangle
      </button>
      <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={addCircle}>
        Add Circle
      </button>
      <div>
        <label className="block mb-2">Text Size</label>
        <input type="number" value={textSize} onChange={handleTextSizeChange} className="w-full" />
      </div>
      <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={addText}>
        Add Text
      </button>
      <div>
        <label className="block mb-2">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
      </div>
      <div>
        <label className="block mb-2">Animation X</label>
        <input type="number" value={animationX} onChange={handleAnimationXChange} className="w-full" />
      </div>
      <div>
        <label className="block mb-2">Animation Y</label>
        <input type="number" value={animationY} onChange={handleAnimationYChange} className="w-full" />
      </div>
      <div>
        <label className="block mb-2">Animation Duration (seconds)</label>
        <input type="number" value={animationDuration} onChange={handleAnimationDurationChange} className="w-full" />
      </div>
      <button className="px-4 py-2 bg-purple-500 text-white rounded" onClick={animateElement}>
        Animate Element
      </button>
    </div>
  );
};

export default ControlPanel;
