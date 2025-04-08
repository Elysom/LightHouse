
import React, { useState } from 'react';
import CodeModal from './CodeModal';

const CodeButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>Abrir ventana de código</button>
      <CodeModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CodeButton;
