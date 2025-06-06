import './DeleteConfirmationModal.css';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
  isDeleting?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  isDeleting = false
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h2>Delete {itemType}</h2>
          <button className="close-button" onClick={onClose} disabled={isDeleting}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to delete <strong>"{itemName}"</strong>?</p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;