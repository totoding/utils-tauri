import { useState, useMemo } from 'react';
import { Button, Input, Message } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import Projects from "./Projects";
import ProjectForm from './ProjectForm';
import { ProjectProvider } from './ProjectContext';
import { arrayMove } from "@dnd-kit/sortable";
import "./index.css";
import { motion, AnimatePresence } from 'motion/react';
const mockProjectList = [
  { id: 1, name: 'Project Alpha', desc: '1' },
  { id: 2, name: 'Project Beta', desc: '2' },
  { id: 3, name: 'Project Gamma', desc: '3' },
];

export interface ProjectRow {
  id?: number;
  name: string;
  desc?: string;
}

export default function ProjectPage() {
  const [allProjects, setAllProjects] = useState<ProjectRow[]>(mockProjectList);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [projectFormVisible, setProjectFormVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null);

  const displayProjects = useMemo(() => {
    if (!searchKeyword.trim()) {
      return allProjects;
    }
    return allProjects.filter(project =>
      project.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [allProjects, searchKeyword]);

  const filterProjects = (value: string) => {
    setSearchKeyword(value);
  };

  const showProjectForm = () => {
    setEditingProject(null); // 清空编辑状态，表示新建
    setProjectFormVisible(true);
  };

  const handleProjectFormClose = () => {
    setProjectFormVisible(false);
    setEditingProject(null);
  };

  const projectFormSubmit = async (data: Omit<ProjectRow, 'id'>) => {
    if (editingProject) {
      // 编辑模式
      setAllProjects(prev => prev.map(project =>
        project.id === editingProject.id
          ? { ...project, ...data }
          : project
      ));
      Message.success('项目更新成功');
    } else {
      // 新建模式
      const newProject: ProjectRow = {
        id: allProjects.length + 1,
        ...data
      };
      setAllProjects(prev => [...prev, newProject]);
      Message.success('项目创建成功');
    }

    setProjectFormVisible(false);
    setEditingProject(null);
  };

  const onDragEnd = (event: { active: any, over: any }) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setAllProjects((prev) => {
        const oldIndex = prev.findIndex(item => item.id === active.id);
        const newIndex = prev.findIndex(item => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  // 定义所有项目操作函数
  const handleEditProject = (project: ProjectRow) => {
    console.log("编辑项目:", project);
    setEditingProject(project);
    setProjectFormVisible(true);
  };

  const handleDeleteProject = (id: number) => {
    setAllProjects(prev => prev.filter(project => project.id !== id));
    Message.success('项目删除成功');
  };

  const handleDuplicateProject = (project: ProjectRow) => {
    const duplicatedProject: ProjectRow = {
      id: allProjects.length + 1,
      name: `${project.name} (副本)`,
      desc: project.desc
    };
    setAllProjects(prev => [...prev, duplicatedProject]);
    Message.success('项目复制成功');
  };

  // 创建 Context 的 value
  const projectContextValue = {
    onEditProject: handleEditProject,
    onDeleteProject: handleDeleteProject,
    onDuplicateProject: handleDuplicateProject,
  };

  return (
    <ProjectProvider value={projectContextValue}>
      <AnimatePresence>
        <motion.div
          className="box-border w-full flex"
          initial={{ opacity: 0, }}
          animate={{ opacity: 1,}}
     
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="w-[300px] h-[calc(100vh-50px)] p-2 box-border"
            initial={{ opacity: 0, }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="flex w-full max-w-sm items-center gap-2 mb-2">
              <Input.Search allowClear onChange={filterProjects} />
              <Button type='primary' style={{ width: '40px' }} icon={<IconPlus />} onClick={showProjectForm} />
            </div>
            <div className='overlay-scrollbar h-[calc(100vh-110px)] overflow-y-auto pr-1'>
              <Projects projectList={displayProjects} onDragEnd={onDragEnd} />
            </div>
          </motion.div>
          <ProjectForm
            visible={projectFormVisible}
            onClose={handleProjectFormClose}
            onSubmit={projectFormSubmit}
            initialValues={editingProject || undefined}
          />
        </motion.div>
      </AnimatePresence>
    </ProjectProvider>
  );
}