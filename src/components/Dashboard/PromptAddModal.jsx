import PropTypes from "prop-types";

const Modal = ({ title, children, modalOpen = false, setModalOpen, width }) => {
  return (
    <div className="">
      <input
        value={modalOpen}
        type="checkbox"
        checked={modalOpen}
        onChange={() => setModalOpen(!modalOpen)}
        className={`modal-toggle bg-[#4E505A] h-screen`}
      />
      <div className="modal">
        <div className="relative modal-box">
          <label
            onClick={() => setModalOpen(!modalOpen)}
            className="absolute btn btn-sm btn-circle right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-[25px] font-bold">{title}</h3>
          <div className="py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};
