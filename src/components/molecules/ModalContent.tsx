import { ReactNode } from 'react';

interface ModalContentProps {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const ModalHeader = ({ title }: { title: string }) => (
  <div className="px-6 py-4 border-b border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
  </div>
);

export const ModalBody = ({ children }: { children: ReactNode }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

export const ModalFooter = ({ children }: { children: ReactNode }) => (
  <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
    {children}
  </div>
);

export const ModalContent = ({ title, description, children, actions }: ModalContentProps) => (
  <div className="flex flex-col">
    {title && <ModalHeader title={title} />}
    <ModalBody>
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      {children}
    </ModalBody>
    {actions && <ModalFooter>{actions}</ModalFooter>}
  </div>
);
