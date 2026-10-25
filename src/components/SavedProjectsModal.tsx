'use client';

import React from 'react';
import { X, FolderOpen, Trash2, ArrowRight, Plus, Calendar, User, Zap } from 'lucide-react';
import { SavedProject } from '../types/solar';

interface SavedProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SavedProject[];
  onLoadProject: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  onSaveCurrentAsNew: () => void;
}

export const SavedProjectsModal: React.FC<SavedProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  onLoadProject,
  onDeleteProject,
  onSaveCurrentAsNew,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FolderOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Saved Site Audits</h3>
              <p className="text-xs text-slate-400">Open, review, or delete past client setups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {projects.length} {projects.length === 1 ? 'audit' : 'audits'} saved
          </span>

          <button
            onClick={() => {
              onSaveCurrentAsNew();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Save Current Site Audit
          </button>
        </div>

        {/* List of projects */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {projects.length > 0 ? (
            projects.map((p) => {
              const activeCount = p.appliances.filter((a) => a.quantity > 0).length;
              const totalWatts = p.appliances.reduce(
                (sum, a) => sum + a.quantity * a.ratedWatts,
                0
              );

              return (
                <div
                  key={p.id}
                  className="group rounded-xl p-4 bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">
                        {p.clientName || 'Unnamed Site Audit'}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{activeCount} load items</span>
                      <span>•</span>
                      <span className="text-amber-300 font-semibold">{totalWatts.toLocaleString()} W</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        onLoadProject(p);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all"
                    >
                      <span>Load Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400">
              <FolderOpen className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-slate-300">No saved projects yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Save client load audits to quickly restore them for future site visits.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-xl text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
