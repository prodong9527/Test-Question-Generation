import mammoth from 'mammoth';
import JSZip from 'jszip';

async function parsePPT(fileBuffer) {
  try {
    const zip = new JSZip();
    await zip.loadAsync(fileBuffer);

    let text = '';
    const slideTexts = [];

    for (const [name, file] of Object.entries(zip.files)) {
      if (name.match(/ppt\/slides\/slide[0-9]+\.xml$/)) {
        const content = await file.async('string');
        const slideText = extractTextFromXML(content);
        if (slideText) {
          slideTexts.push(slideText);
        }
      }
    }

    text = slideTexts.join('\n\n');
    return text || '无法解析PPT内容';
  } catch (error) {
    console.error('PPT解析错误:', error);
    return 'PPT解析失败，请确保文件格式正确';
  }
}

async function parsePPTX(fileBuffer) {
  try {
    const zip = new JSZip();
    await zip.loadAsync(fileBuffer);

    let text = '';
    const slideTexts = [];

    for (const [name, file] of Object.entries(zip.files)) {
      if (name.match(/ppt\/slides\/slide[0-9]+\.xml$/)) {
        const content = await file.async('string');
        const slideText = extractTextFromXML(content);
        if (slideText) {
          slideTexts.push(slideText);
        }
      }
    }

    text = slideTexts.join('\n\n');

    const relsFiles = Object.keys(zip.files).filter(name => name.match(/ppt\/slides\/_rels\/slide[0-9]+\.xml\.rels$/));
    for (const relsName of relsFiles) {
      const relsContent = await zip.files[relsName].async('string');
      const linkMatches = relsContent.match(/Target="([^"]+)"/g);
      if (linkMatches) {
        for (const match of linkMatches) {
          const link = match.match(/Target="([^"]+)"/)[1];
          if (link.startsWith('http')) {
            text += '\n' + link;
          }
        }
      }
    }

    return text || '无法解析PPTX内容';
  } catch (error) {
    console.error('PPTX解析错误:', error);
    return 'PPTX解析失败，请确保文件格式正确';
  }
}

async function parsePDF(fileBuffer) {
  try {
    const pdfParseModule = await import('pdf-parse/lib/pdf-parse.js');
    const data = await pdfParseModule.default(fileBuffer);
    return data.text || '无法解析PDF内容';
  } catch (error) {
    console.error('PDF解析错误:', error);
    return 'PDF解析失败，请确保文件格式正确';
  }
}

async function parseDOCX(fileBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value || '无法解析Word内容';
  } catch (error) {
    console.error('Word解析错误:', error);
    return 'Word解析失败，请确保文件格式正确';
  }
}

async function parseDOC(fileBuffer) {
  return '暂不支持.doc格式，请转换为.docx或.pdf格式';
}

function extractTextFromXML(xml) {
  const textMatches = xml.match(/<a:t>([^<]*)<\/a:t>/g);
  if (!textMatches) return '';

  const texts = textMatches.map(match => {
    const content = match.replace(/<\/?a:t>/g, '');
    return content.trim();
  }).filter(text => text.length > 0);

  return texts.join(' ');
}

async function parseFile(fileBuffer, mimeType) {
  switch (mimeType) {
    case 'application/pdf':
      return await parsePDF(fileBuffer);
    case 'application/vnd.ms-powerpoint':
      return await parsePPT(fileBuffer);
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return await parsePPTX(fileBuffer);
    case 'application/msword':
      return await parseDOC(fileBuffer);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return await parseDOCX(fileBuffer);
    default:
      return '不支持的文件格式';
  }
}

export { parseFile };