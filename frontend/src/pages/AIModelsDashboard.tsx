import { useQuery } from '@tanstack/react-query';
import { fetchModelCatalog, fetchDriftMetrics } from '@/api/ai';
import { DemoBadge } from '@/components/common/DemoBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/cards/Card';
import { BrainCircuit, ShieldCheck, Cpu, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AIModelsDashboard() {
  const { data: catalogData, isLoading: isLoadingCatalog, refetch: refetchCatalog } = useQuery({
    queryKey: ['aiModelCatalog'],
    queryFn: fetchModelCatalog,
  });

  const { data: driftData } = useQuery({
    queryKey: ['aiDriftMetrics'],
    queryFn: fetchDriftMetrics,
  });

  const models = catalogData?.active_models ?? [
    {
      model_id: 'mod_churn_xgb',
      model_name: 'Churn Risk Predictor',
      model_type: 'Binary Classification',
      version: 'v1.4.2',
      stage: 'Production',
      auc_roc: 0.914,
      last_trained_at: new Date().toISOString()
    },
    {
      model_id: 'mod_eng_lgbm',
      model_name: 'Engagement Score Regressor',
      model_type: 'Regression',
      version: 'v1.2.0',
      stage: 'Production',
      rmse: 2.45,
      last_trained_at: new Date().toISOString()
    },
    {
      model_id: 'mod_persona_rf',
      model_name: 'Behavioral Persona Classifier',
      model_type: 'Multi-class Classification',
      version: 'v1.1.0',
      stage: 'Production',
      auc_roc: 0.885,
      last_trained_at: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <BrainCircuit className="w-7 h-7 text-purple-400" />
            <span>AI Platform & Model Registry</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/50">
              Model Registry & MLOps
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Centralized Machine Learning Model Registry, SHAP explainability catalog, and feature drift monitoring.
          </p>
          <DemoBadge className="mt-2" />
        </div>
        <button
          onClick={() => refetchCatalog()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Registry
        </button>
      </div>

      {/* MLOps Health & Drift Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/50 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-medium block">Population Stability Index (PSI)</span>
              <span className="text-xl font-extrabold text-zinc-100">
                {driftData?.psi_score ?? 0.042} (Healthy)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800/50 text-purple-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-medium block">Feature Store Pipeline</span>
              <span className="text-xl font-extrabold text-zinc-100">Inference Ready</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/50 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-400 font-medium block">Active Champion Models</span>
              <span className="text-xl font-extrabold text-zinc-100">{models.length} Production</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Catalog Table */}
      <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
            <span>Production ML Models Registry</span>
            <span className="text-xs font-normal text-purple-400 bg-purple-950/60 border border-purple-800/50 px-2.5 py-1 rounded-full">
              Champion Models Pipeline
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingCatalog ? (
            <div className="h-48 bg-zinc-900/40 animate-pulse rounded-lg" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
                    <th className="py-3 px-4">Model Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Version</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Performance Metric</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((m, i) => (
                    <tr key={i} className="border-b border-zinc-800/40 hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-zinc-100">{m.model_name}</td>
                      <td className="py-3.5 px-4 text-zinc-400">{m.model_type}</td>
                      <td className="py-3.5 px-4 font-mono text-purple-300">{m.version}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          {m.stage}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-200">
                        {m.auc_roc ? `AUC-ROC: ${m.auc_roc}` : `RMSE: ${m.rmse}`}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Ready
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
