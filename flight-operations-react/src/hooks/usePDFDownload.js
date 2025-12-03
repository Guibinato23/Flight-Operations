import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePDFDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const downloadPDF = async (elementId, filename) => {
    try {
      setIsGenerating(true);
      setStatus('Gerando PDF...');

      // Aguarda renderização completa do mapa e todos os elementos
      await new Promise(resolve => setTimeout(resolve, 1500));

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Elemento não encontrado');
      }

      // Força re-renderização do mapa Leaflet
      const mapContainer = element.querySelector('.leaflet-container');
      if (mapContainer && mapContainer._leaflet_map) {
        mapContainer._leaflet_map.invalidateSize();
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Captura todo o conteúdo do elemento com máxima qualidade
      const canvas = await html2canvas(element, {
        scale: 3, // Alta qualidade (3x resolução)
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        scrollY: 0,
        scrollX: 0,
        imageTimeout: 15000,
        letterRendering: true,
        removeContainer: false,
        onclone: (clonedDoc) => {
          // Garante que elementos do mapa sejam renderizados
          const clonedMap = clonedDoc.querySelector('.leaflet-container');
          if (clonedMap) {
            clonedMap.style.width = '100%';
            clonedMap.style.height = '260px';
          }
          
          // Garante qualidade das imagens
          const images = clonedDoc.querySelectorAll('img');
          images.forEach(img => {
            img.style.imageRendering = 'high-quality';
            img.style.imageRendering = '-webkit-optimize-contrast';
          });
        }
      });

      // Dimensões A4 em pontos (72 DPI) para o PDF
      const a4WidthPt = 595.28;  // 210mm
      const a4HeightPt = 841.89; // 297mm
      
      // Calcula altura necessária mantendo a proporção da largura A4
      const imgWidthPt = a4WidthPt;
      const imgHeightPt = (canvas.height * a4WidthPt) / canvas.width;
      
      // Converte canvas para imagem PNG de máxima qualidade (sem compressão)
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Cria PDF com altura dinâmica se necessário
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: imgHeightPt > a4HeightPt ? [a4WidthPt, imgHeightPt] : 'a4',
        compress: false, // Sem compressão para máxima qualidade
        precision: 16
      });
      
      // Adiciona imagem em PNG de alta qualidade
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidthPt, imgHeightPt, '', 'FAST');
      
      // Salva o arquivo
      pdf.save(filename);

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
