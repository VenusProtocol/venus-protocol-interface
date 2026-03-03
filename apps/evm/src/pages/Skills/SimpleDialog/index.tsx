import { DialogExample } from '../DialogExample';
import { DialogMessage } from '../DialogMessage';

interface SimpleDialogProps {
  agentMessage: string;
  userMessage: string;
}

export const SimpleDialog: React.FC<SimpleDialogProps> = ({ agentMessage, userMessage }) => (
  <DialogExample>
    <DialogMessage variant="user">{userMessage}</DialogMessage>
    <DialogMessage variant="agent">{agentMessage}</DialogMessage>
  </DialogExample>
);
