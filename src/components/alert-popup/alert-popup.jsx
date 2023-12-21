import PropTypes from 'prop-types';

import './alert-popup.css';

export default function AleartPopup({message, title, isActive, color}){
  
    return (
        (
            <div  className={`toast ${isActive && 'active'}`}>
                <div className="toast-content">
                    <i style={{backgroundColor: color || '#4070f4'}}  className="fas fa-solid fa-check check" />

                    <div className="message">
                    <span className="text text-1">{title}</span>
                    <span className="text text-2">{message}</span>
                    </div>
                </div>
                <i className="fa-solid fa-xmark close" />

                <div style={{backgroundColor: color || '#4070f4'}} className={`progress ${isActive && 'active'}`} />
            </div>
        )
    )
}


AleartPopup.propTypes = {
    message: PropTypes.string,
    title: PropTypes.string,
    isActive: PropTypes.bool,
    color: PropTypes.string
}