import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export const usePDFDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const downloadPDF = async (elementId, filename) => {
    try {
      setIsGenerating(true);
      setStatus('Gerando PDF...');

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Elemento não encontrado');
      }

      const opt = {
        margin: [5, 5, 5, 5],
        filename: filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: false,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          scrollY: 0,
          scrollX: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();

      setStatus('PDF Baixado!');
      setTimeout(() => {
        setStatus('');
        setIsGenerating(false);
      }, 2500);

      return true;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setStatus('Erro ao gerar PDF');
      setTimeout(() => {
        setStatus('');
        setIsGenerating(false);
      }, 3000);
      return false;
    }
  };

  const print = () => {
    window.print();
  };

  return {
    downloadPDF,
    print,
    isGenerating,
    status
  };
};
