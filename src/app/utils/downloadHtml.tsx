const downloadHtml = (htmlContent: string, styles: string) => {
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exported Canvas</title>
        <style>
          body { margin: 0; padding: 0; }
          .canvas-container { position: relative; width: 100vw; height: 100vh; }
          .canvas-element { position: absolute; }
          ${styles}
        </style>
      </head>
      <body>
        <div class="canvas-container">
          ${htmlContent}
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'canvas.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default downloadHtml;
