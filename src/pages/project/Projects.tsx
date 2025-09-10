import { useState } from "react";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Link, Dropdown, Menu } from '@arco-design/web-react';
import { IconMore } from '@arco-design/web-react/icon';
import type { ProjectRow } from "./index";
import { useProjectContext } from './ProjectContext';

interface SortableItemProps {
  project: ProjectRow | null | undefined;
  active?: boolean;
  handleCardClick?: (id: number) => void;
  paceholder?: boolean;
}

function SortableItem({ project, active, handleCardClick, paceholder = false }: SortableItemProps) {
  const { onEditProject, onDeleteProject, onDuplicateProject } = useProjectContext();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project?.id ?? 0 });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    rotate: paceholder ? "5deg" : "0deg",
  };

  // 处理各种操作
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project) {
      onEditProject(project);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project?.id) {
      onDeleteProject(project.id);
    }
  };

  const dropdownMenu = (
    <Menu>
      <Menu.Item key="edit" onClick={handleEditClick}>
        编辑
      </Menu.Item>
      <Menu.Item key="delete" onClick={handleDeleteClick} style={{ color: '#f53f3f' }}>
        删除
      </Menu.Item>
    </Menu>
  );

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        p-0 mb-2 bg-slate-100 border-0 rounded-none
        ${isDragging ? 'bg-slate-50 border-2 border-dashed border-slate-300 text-slate-400 opacity-50 select-none' : ''}
      `}
    >
      <Card
        bodyStyle={{ padding: '8px' }}
        className='hover:shadow-lg rounded-md select-none'
        onClick={() => handleCardClick?.(project?.id ?? 0)}
        style={{
          background: active ? "#f4f4f5" : "#ffffff",
        }}
      >
        <div className="flex items-center w-full">
          <div
            {...listeners}
            className="cursor-grab p-1 text-slate-500 flex items-center w-[20px]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            ⋮⋮
          </div>
          <div className="flex justify-between flex-1">
            <div className="flex-1 text-left">{project?.name}</div>
            <div onClick={handleDropdownClick}>
              <Dropdown droplist={dropdownMenu} trigger="click">
                <Link>
                  <IconMore />
                </Link>
              </Dropdown>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface VerticalListProps {
  projectList: ProjectRow[];
  onDragEnd: (event: { active: any, over: any }) => void;
}

export default function VerticalList({ projectList, onDragEnd }: VerticalListProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor)
  );
  const activeItem = activeId ? projectList.find(item => item.id === activeId) : null;
  
  const handleCardClick = (id: number) => {
    setActiveId(id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        setActiveId(active.id as number);
      }}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={projectList.map(p => p.id).filter((id): id is number => id !== undefined)} strategy={verticalListSortingStrategy}>
        {projectList.map((item) => (
          <SortableItem
            key={item.id}
            project={item}
            active={activeId === item.id}
            handleCardClick={handleCardClick}
          />
        ))}
      </SortableContext>

      <DragOverlay>
        <SortableItem
          key={activeItem?.id}
          project={activeItem}
          paceholder={true}
        />
      </DragOverlay>
    </DndContext>
  );
}