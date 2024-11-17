const Buttoncomp = ({title, className, message, onClick}) => {

    const title2 = title;
    const className2 = className; 
    
        return (
    
           <button
           type="button"
         className={className2} 
           title={title2}
           onClick= {onClick}>
            {message}</button>
        )
    }
    
    export default Buttoncomp;