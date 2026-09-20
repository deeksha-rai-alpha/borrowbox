import "./Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="bb-modal__overlay" onClick={onClose}>
      <div className="bb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bb-modal__header">
          <h4>{title}</h4>
          <button className="bb-modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="bb-modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
