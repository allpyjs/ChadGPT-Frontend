import PropTypes from "prop-types";
import "./PromptModal.css";

const PromptModal = ({
  title,
  children,
  modalOpen = false,
  setModalOpen,
  width,
}) => {
  return (
    <div>
      <input
        value={modalOpen}
        type='checkbox'
        checked={modalOpen}
        onChange={() => setModalOpen(!modalOpen)}
        className={`modal-toggle overflow-y-hidden`}
      />
      <div className='modal'>
        <div className='relative modal-box bg-red bg-[#202123] rounded-[10px] border-[#333333] border-[1px] shadow-lg backdrop-blur-md custom-scrollbar'>
          <label
            onClick={() => setModalOpen(!modalOpen)}
            className='absolute btn btn-sm btn-circle right-2 top-2 bg-[#444444] hover:bg-[#555555] border-none'
          >
            ✕
          </label>
          <h3 className='text-[30px] font-medium text-white text-center'>
            {title}
          </h3>
          <div className='py-4'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;

PromptModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};
