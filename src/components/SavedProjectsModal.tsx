'use client';

import React from 'react';
import { X, FolderOpen, Trash2, ArrowRight, Plus, Calendar, User } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-muted border border-border text-solar">
              <FolderOpen className="w-4 h-4 stroke-[2.25]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Saved Site Audits</h3>
              <p className="text-xs text-muted-foreground">Restore client audit profiles or remove obsolete snapshots.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close saved audits"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">
            {projects.length} {projects.length === 1 ? 'audit' : 'audits'} stored locally
          </span>

          <button
            type="button"
            onClick={() => {
              onSaveCurrentAsNew();
              onClose();
            }}
            className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Save Current Workspace</span>
          </button>
        </div>

        {/* Project List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2.5">
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
                  className="rounded-lg p-3.5 bg-muted/30 border border-border hover:border-border/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <h4 className="text-sm font-semibold text-foreground">
                        {p.clientName || 'Untitled Site Audit'}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="text-border">•</span>
                      <span>{activeCount} active items</span>
                      <span className="text-border">•</span>
                      <span className="text-solar font-semibold">{totalWatts.toLocaleString()} W</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => onDeleteProject(p.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                      title="Delete saved audit"
                      aria-label="Delete audit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onLoadProject(p);
                        onClose();
                      }}
                      className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors cursor-pointer"
                    >
                      <span>Restore Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">No saved site audits</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Save an audit snapshot to reload it during follow-up client site visits.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-card border-t border-border text-right">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
