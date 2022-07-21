import React from 'react';

export default function Banner() {
  return (
    <div className="flex justify-center mt-24">
      <button
        onClick={async () => {
          const result = await fetch('/api/banner/build', {
            method: 'POST',
          });

          const blob = await result.blob();
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'monkedao_banner.png');
          document.body.appendChild(link);
          link.click();
          link?.parentNode?.removeChild(link);
        }}
      >
        Download
      </button>
    </div>
  );
}
