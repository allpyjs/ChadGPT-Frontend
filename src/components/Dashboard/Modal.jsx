import PropTypes from "prop-types";

const Modal = ({ title, children, modalOpen = false, setModalOpen, width }) => {
  return (
    <div>
      <input
        value={modalOpen}
        type='checkbox'
        checked={modalOpen}
        onChange={() => setModalOpen(!modalOpen)}
        className={`modal-toggle bg-[#4E505A]`}
      />
      <div className='modal'>
        <div className='relative modal-box bg-red bg-[#202123] rounded-[10px] border-[#333333] backdrop-blur-md'>
          <label
            onClick={() => setModalOpen(!modalOpen)}
            className='absolute btn btn-sm btn-circle right-2 top-2 bg-[#444444] hover:bg-[#555555] border-none'
          >
            ✕
          </label>
          <h3 className='text-[35px] font-bold text-white text-center'>
            {title}
          </h3>
          <div className='py-4'>{children}</div>
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
