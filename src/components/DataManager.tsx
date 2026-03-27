import React, { useState, useRef } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { exportToJSON, exportSessionsToCSV, downloadFile, importFromJSON } from '../utils/export';
import { Button, Modal } from './ui';

export const DataManager: React.FC = () => {
  const { books, notes, sessions, importData, resetData } = useAppStore();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExportJSON = () => {
    const json = exportToJSON(books, notes, sessions);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(json, `bookflow-backup-${date}.json`, 'application/json');
  };
  
  const handleExportCSV = () => {
    const csv = exportSessionsToCSV(sessions, books);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(csv, `bookflow-sessions-${date}.csv`, 'text/csv');
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportError(null);
    setImportSuccess(false);
    
    try {
      const data = await importFromJSON(file);
      importData(data);
      setImportSuccess(true);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportSuccess(false);
      }, 1500);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '导入失败');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleReset = () => {
    if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
      resetData();
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Export */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          导出数据
        </h3>
        <div className="flex gap-3">
          <Button onClick={handleExportJSON} variant="ghost">
            <Download className="w-4 h-4 mr-2" />
            导出 JSON (完整备份)
          </Button>
          <Button onClick={handleExportCSV} variant="ghost">
            <Download className="w-4 h-4 mr-2" />
            导出 CSV (阅读记录)
          </Button>
        </div>
      </div>
      
      {/* Import */}
      <div className="pt-4 border-t border-[var(--color-border)]">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          导入数据
        </h3>
        <Button onClick={() => setIsImportModalOpen(true)} variant="ghost">
          <Upload className="w-4 h-4 mr-2" />
          导入 JSON 备份
        </Button>
        <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
          导入会覆盖当前所有数据，请确保已备份重要数据。
        </p>
      </div>
      
      {/* Reset */}
      <div className="pt-4 border-t border-[var(--color-border)]">
        <h3 className="text-sm font-semibold text-[var(--color-danger)] mb-3">
          危险区域
        </h3>
        <Button onClick={handleReset} variant="danger">
          <AlertTriangle className="w-4 h-4 mr-2" />
          清空所有数据
        </Button>
      </div>
      
      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="导入数据"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            选择之前导出的 JSON 文件，导入后会覆盖当前所有数据。
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="block w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--color-accent)] file:text-white hover:file:bg-[var(--color-accent-hover)]"
          />
          
          {importError && (
            <p className="text-sm text-[var(--color-danger)]">{importError}</p>
          )}
          
          {importSuccess && (
            <p className="text-sm text-[var(--color-success)]">导入成功！</p>
          )}
        </div>
      </Modal>
    </div>
  );
};
