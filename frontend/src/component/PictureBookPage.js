const PictureBookPage = ({ src }) => {
  const isImage = src.startsWith("https://expclients.com");
  const srcIframe = src.startsWith("http://") || src.startsWith("https://") ? src : "https://" + src;

  return (
    <div>
      {isImage ? (
        <img src={src} alt="Book page"/>
      ) : (
        <iframe src={srcIframe} title="Book page" style={{ width: '25vw', height: '37.15vw' }}></iframe>
      )}
    </div>
  );
};

export default PictureBookPage;
