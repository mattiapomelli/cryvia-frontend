import { Resource } from '@/api/types'
import Modal, { BaseModalProps } from '@/components/UI/Modal'

interface ResourcesModalProps extends BaseModalProps {
  resources: Resource[]
}

const ResourcesModal = ({ show, onClose, resources }: ResourcesModalProps) => {
  return (
    <Modal show={show} onClose={onClose}>
      <h4 className="font-bold text-xl mb-4">Resources</h4>
      <p>
        Here are some recommended resources to study in order to prepare for the
        quiz:
      </p>
      <ul className="mt-4 flex flex-col gap-2 mb-2">
        {resources.map((resource) => (
          <li key={resource.id}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover underline"
            >
              {resource.title}
            </a>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export default ResourcesModal
