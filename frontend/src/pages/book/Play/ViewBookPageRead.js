const ViewPageRead = ({ view, classNamepictureonpage }) => {
  return (
    <>
      <div className={classNamepictureonpage}>
        {view &&
          view.map((page, key) => {
            //Map argument de tableau
            return (
              <div key={key} className="">
                <img src={page.lien} />

                <div className="alignement"></div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ViewPageRead;
