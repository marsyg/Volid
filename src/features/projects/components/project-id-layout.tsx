'use client';
import { Id } from '../../../../convex/_generated/dataModel';
import Navbar from './navbar';
import { Allotment } from 'allotment';
import { ConversationSidebar } from './conversation-sidebar';

const MAX_SIDEBAR_WIDTH = 800;
const MIN_SIDEBAR_WIDTH = 200;
const DEFAULT_SIDEBAR_WIDTH = 300;
const DEFAULT_MAIN_SIZE = 1000;
import 'allotment/dist/style.css';
const ProjectIdLayout = ({
  projectId,
  children,
}: {
  projectId: Id<'projects'>;
  children: React.ReactNode;
}) => (
  <div className="w-full h-screen flex flex-col">
    <Navbar projectId={projectId}></Navbar>
    <div className="flex-1">
      <Allotment
        className="flex-1 overflow-hidden"
        defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}
      >
        <Allotment.Pane
          snap
          minSize={MIN_SIDEBAR_WIDTH}
          maxSize={MAX_SIDEBAR_WIDTH}
          preferredSize={DEFAULT_SIDEBAR_WIDTH}
        >
          <ConversationSidebar projectId={projectId} />
        </Allotment.Pane>
        <Allotment.Pane snap minSize={MIN_SIDEBAR_WIDTH}>
          {children}
        </Allotment.Pane>
      </Allotment>
    </div>
  </div>
);

export default ProjectIdLayout;
