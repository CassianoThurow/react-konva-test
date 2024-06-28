'use client'
import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Konva from 'konva';
import downloadHtml from '@/app/utils/downloadHtml';

const Canvas = dynamic(() => import('@/app/components/Canvas'), { ssr: false });
const ControlPanel = dynamic(() => import('@/app/components/ControlPanel'), { ssr: false });

const Home: React.FC = () => {
  const [elements, setElements] = useState<any[]>([]);
  const [animationStyles, setAnimationStyles] = useState<string>('');
  const stageRef = useRef<Konva.Stage>(null);

  const addElement = (element: any) => {
    setElements([...elements, element]);
  };

  const updateElement = (id: string, newAttrs: any) => {
    const updatedElements = elements.map((el) => {
      if (el.id === id) {
        return { ...el, attrs: { ...el.attrs, ...newAttrs } };
      }
      return el;
    });
    setElements(updatedElements);
  };

  const addAnimationStyle = (style: string) => {
    setAnimationStyles((prevStyles) => prevStyles + style);
  };

  const renderElement = (node: any) => {
    switch (node.className) {
      case 'Rect':
        return `<div class="canvas-element ${node.attrs.animationClass || ''}" style="top: ${node.attrs.y}px; left: ${node.attrs.x}px; width: ${node.attrs.width}px; height: ${node.attrs.height}px; background-color: ${node.attrs.fill};"></div>`;
      case 'Circle':
        return `<div class="canvas-element ${node.attrs.animationClass || ''}" style="top: ${node.attrs.y - node.attrs.radius}px; left: ${node.attrs.x - node.attrs.radius}px; width: ${node.attrs.radius * 2}px; height: ${node.attrs.radius * 2}px; border-radius: 50%; background-color: ${node.attrs.fill};"></div>`;
      case 'Text':
        return `<div class="canvas-element ${node.attrs.animationClass || ''}" style="top: ${node.attrs.y}px; left: ${node.attrs.x}px; font-size: ${node.attrs.fontSize}px; color: ${node.attrs.fill};">${node.attrs.text}</div>`;
      case 'Image':
        return `<img src="${node.attrs.src}" class="canvas-element ${node.attrs.animationClass || ''}" style="top: ${node.attrs.y}px; left: ${node.attrs.x}px; width: ${node.attrs.width}px; height: ${node.attrs.height}px;" />`;
      default:
        return '';
    }
  };

  const exportToHtml = () => {
    if (!stageRef.current) return;
    const json = stageRef.current.toJSON();
    const parsedData = JSON.parse(json);
    const htmlContent = parsedData.children[0].children.map((node: any) => renderElement(node)).join('');
    downloadHtml(htmlContent, animationStyles);
  };

  return (
    <div>
      <Head>
        <title>Dynamic Canvas with React Konva</title>
      </Head>
      <main className="flex">
        <ControlPanel 
          addElement={addElement} 
          stageRef={stageRef} 
          updateElement={updateElement}
          addAnimationStyle={addAnimationStyle}
        />
        <Canvas 
          elements={elements} 
          setElements={setElements} 
          stageRef={stageRef} 
          animationStyles={animationStyles} 
          renderElement={renderElement} 
          downloadHtml={downloadHtml} 
          exportToHtml={exportToHtml}
        />
      </main>
    </div>
  );
};

export default Home;
