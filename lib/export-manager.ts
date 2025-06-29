import { ClientData, WorkerData, TaskData } from '@/types/data-types';
import { BusinessRule, PrioritizationProfile, ExportConfiguration } from '@/types/rule-types';
import * as XLSX from 'xlsx';

export async function exportData(
  config: ExportConfiguration,
  data: {
    clientData: ClientData[];
    workerData: WorkerData[];
    taskData: TaskData[];
    businessRules: BusinessRule[];
    prioritizationProfile: PrioritizationProfile;
  },
  originalFormats: {
    clients?: 'csv' | 'xlsx';
    workers?: 'csv' | 'xlsx';
    tasks?: 'csv' | 'xlsx';
  }
) {
  const exports: { filename: string; content: string | Blob }[] = [];

  if (config.includeCleanedData) {
    // Export each data type in its original format
    if (data.clientData.length > 0) {
      const format = originalFormats.clients || 'csv';
      if (format === 'xlsx') {
        exports.push(exportSingleDataAsXLSX(data.clientData, 'clients_cleaned.xlsx'));
      } else {
        exports.push({
          filename: 'clients_cleaned.csv',
          content: convertToCSV(data.clientData)
        });
      }
    }

    if (data.workerData.length > 0) {
      const format = originalFormats.workers || 'csv';
      if (format === 'xlsx') {
        exports.push(exportSingleDataAsXLSX(data.workerData, 'workers_cleaned.xlsx'));
      } else {
        exports.push({
          filename: 'workers_cleaned.csv',
          content: convertToCSV(data.workerData)
        });
      }
    }

    if (data.taskData.length > 0) {
      const format = originalFormats.tasks || 'csv';
      if (format === 'xlsx') {
        exports.push(exportSingleDataAsXLSX(data.taskData, 'tasks_cleaned.xlsx'));
      } else {
        exports.push({
          filename: 'tasks_cleaned.csv',
          content: convertToCSV(data.taskData)
        });
      }
    }
  }

  if (config.includeRules) {
    const rulesConfig = {
      rules: data.businessRules.filter(rule => rule.enabled),
      metadata: {
        exportedAt: new Date().toISOString(),
        totalRules: data.businessRules.length,
        enabledRules: data.businessRules.filter(rule => rule.enabled).length,
        // @ts-ignore
        ruleTypes: [...new Set(data.businessRules.map(rule => rule.type))]
      }
    };

    exports.push({
      filename: 'rules.json',
      content: JSON.stringify(rulesConfig, null, 2)
    });
  }

  if (config.includePrioritization) {
    const prioritizationConfig = {
      profile: data.prioritizationProfile,
      metadata: {
        exportedAt: new Date().toISOString(),
        totalCriteria: data.prioritizationProfile.criteria.length,
        weightSum: data.prioritizationProfile.criteria.reduce((sum, c) => sum + c.weight, 0)
      }
    };

    exports.push({
      filename: 'prioritization.json',
      content: JSON.stringify(prioritizationConfig, null, 2)
    });
  }

  // Download all files
  for (const exportItem of exports) {
    downloadFile(exportItem.filename, exportItem.content);
  }
}

function exportSingleDataAsXLSX(data: any[], filename: string): { filename: string; content: Blob } {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Data');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  return {
    filename,
    content: blob
  };
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

function downloadFile(filename: string, content: string | Blob) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}