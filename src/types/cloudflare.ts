export interface CloudflareDeployment {
  id: string;
  url: string;
  environment: string;
  latest_stage: {
    name: string;
    started_on: string | null;
    ended_on: string | null;
    status: string;
  };
  created_on: string;
  modified_on: string;
  deployment_trigger: {
    type: string;
    metadata: {
      branch?: string;
      commit_hash?: string;
      commit_message?: string;
    };
  };
}

export interface CloudflareDeploymentsResponse {
  result: CloudflareDeployment[];
  result_info: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
    total_pages: number;
  };
}

export interface FormattedDeployment {
  id: string;
  url: string;
  environment: string;
  status: string;
  createdOn: string;
  modifiedOn: string;
  startedOn: string | null;
  endedOn: string | null;
  stageName: string;
  triggerType: string;
  branch?: string;
  commitHash?: string;
  commitMessage?: string;
}

export interface DeploymentHistoryResponse {
  deployments: FormattedDeployment[];
  pagination: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
    total_pages: number;
  };
}
