import moment from 'moment';
import useContext from './useContext';

function downloadURI(uri, name) {
  const ref = {};
  ref.link = document.createElement('a');
  ref.link.download = name;
  ref.link.href = uri;
  document.body.appendChild(ref.link);
  ref.link.click();
  document.body.removeChild(ref.link);
  delete ref.link;
}

function downloadScreenshot(ref, screenshotFileFormat) {
  const dataURL = ref.current.toDataURL({
    mimeType: 'image/png',
    pixelRatio: window.devicePixelRatio,
  });
  const filename = screenshotFileFormat
    .replace(/{date}/, moment().format('YYYY-MM-DD HH:mm'))
    .replace(/{fileType}/, 'png');

  downloadURI(dataURL, filename);
}

export default function useScreenshot() {
  const { stageRef, config } = useContext();
  return () => downloadScreenshot(stageRef, config.screenshotFileFormat);
}
