import React, { createContext, useContext, ReactNode } from 'react';
import type { ProjectRow } from './index';

// 定义 Context 的类型
interface ProjectContextType {
  onEditProject: (project: ProjectRow) => void;
  onDeleteProject: (id: number) => void;
  onDuplicateProject: (project: ProjectRow) => void;
  // 可以根据需要添加更多操作
}

// 创建 Context，初始值为 null
const ProjectContext = createContext<ProjectContextType | null>(null);

// 自定义 Hook 来使用 Context
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

// Provider 组件的 Props 类型
interface ProjectProviderProps {
  children: ReactNode;
  value: ProjectContextType;
}

// 导出 Provider 组件
export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children, value }) => {
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// 也可以直接导出 Context 供高级用法使用
export { ProjectContext };