export type ValidationStatus = 'success' | 'error' | 'loading' | null;

export interface ValidationStatuses {
  item1: ValidationStatus;
  item2: ValidationStatus;
  item3: ValidationStatus;
}

export interface Ingress {
  name: string;
  service: string;
  port: string;
}

export interface Repository {
  url: string;
  branch: string;
}

export interface TemplateSource {
  type: 'builtin' | 'external';
  value: string;
  instanceName?: string;
  targetRevision?: string;
}

// 修改 fieldDescriptions 的导出
export const fieldDescriptions = {
  tenantName: {
    label: "Tenant Name",
    tooltip: "The unique identifier for your organization or project"
  },
  appCode: {
    label: "App Code",
    tooltip: "Application identifier code used for resource management and tracking"
  },
  namespace: {
    label: "Namespace",
    tooltip: "Kubernetes namespace where the application will be deployed"
  },
  description: {
    label: "Description",
    tooltip: "Detailed information about the application and its purpose"
  },
  ingress: {
    label: "Ingress",
    tooltip: "Configure external access to services in your Kubernetes cluster",
    name: "Unique name for the ingress rule",
    service: "Target service to route traffic to",
    port: "Port number of the service"
  },
  builtinTemplate: {
    label: "Built-in Template",
    tooltip: "Pre-configured deployment templates maintained by the platform team"
  },
  externalTemplate: {
    label: "External Template",
    tooltip: "Custom deployment template from an external Git repository or URL"
  }
};

// 添加 ClusterQuota 接口定义
export interface ClusterQuota {
  cpu: string;
  memory: string;
  storage: string;
  pvcs: string;
  nodeports: string;
}

// 修改 ClusterDefaults 接口
export interface ClusterDefaults {
  [key: string]: ClusterQuota;  // 使用 ClusterQuota 接口
}

// 添加 clusterDefaults 常量
export const clusterDefaults: ClusterDefaults = {
  SIT: {
    cpu: "2",
    memory: "4",
    storage: "20",
    pvcs: "3",
    nodeports: "2"
  },
  SIT1: {
    cpu: "2",
    memory: "4",
    storage: "20",
    pvcs: "3",
    nodeports: "2"
  },
  UAT: {
    cpu: "4",
    memory: "8",
    storage: "50",
    pvcs: "5",
    nodeports: "3"
  },
  PRD: {
    cpu: "8",
    memory: "16",
    storage: "100",
    pvcs: "10",
    nodeports: "5"
  }
};

// 添加 mockYamlTemplate 函数的导出
export const mockYamlTemplate = (namespace: string | undefined, selectedCluster: string, clusterDefaults: ClusterDefaults) => `apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-deployment
  namespace: ${namespace || 'default'}
  labels:
    app: example
    environment: ${selectedCluster || 'dev'}
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: example
  template:
    metadata:
      labels:
        app: example
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
    spec:
      containers:
      - name: example-app
        image: nginx:1.14.2
        imagePullPolicy: Always
        ports:
        - name: http
          containerPort: 80
          protocol: TCP
        - name: metrics
          containerPort: 8080
          protocol: TCP
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        resources:
          limits:
            cpu: "${clusterDefaults[selectedCluster || 'SIT'].cpu}m"
            memory: "${clusterDefaults[selectedCluster || 'SIT'].memory}Gi"
          requests:
            cpu: "500m"
            memory: "1Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 5
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
        - name: secret-volume
          mountPath: /etc/secrets
          readOnly: true
      volumes:
      - name: config-volume
        configMap:
          name: example-config
      - name: secret-volume
        secret:
          secretName: example-secret
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      serviceAccountName: example-sa`;

// 添加 TenantInfo 接口
export interface TenantInfo {
  id: string;
  name: string;
  secretPath: string;
}

// 添加 tenants 数据
export const tenants: TenantInfo[] = [
  { id: '1', name: 'Tenant A', secretPath: 'secrets/data/tenant-a' },
  { id: '2', name: 'Tenant B', secretPath: 'secrets/data/tenant-b' },
  { id: '3', name: 'Tenant C', secretPath: 'secrets/data/tenant-c' },
];

// 添加 FieldDescription 接口
export interface FieldDescription {
  label: string;
  tooltip: string;
  name?: string;
  service?: string;
  port?: string;
}

// 添加 FieldDescriptions 接口
export interface FieldDescriptions {
  [key: string]: FieldDescription;
}

// 添加 resourceDescriptions 常量
export const resourceDescriptions = {
  cpu: {
    label: "CPU",
    tooltip: "Maximum CPU cores allocated. 1 CPU = 1000m (millicores). For example, 2000m = 2 CPU cores"
  },
  memory: {
    label: "Memory",
    tooltip: "Maximum RAM allocated. Memory in GiB. For example, 4GiB = 4096MiB"
  },
  storage: {
    label: "Storage",
    tooltip: "Maximum storage space for persistent volumes. Storage in GiB. Local and network storage combined"
  },
  pvcs: {
    label: "PVCs",
    tooltip: "Maximum number of persistent volumes that can be created"
  },
  nodeports: {
    label: "NodePorts",
    tooltip: "Maximum number of NodePort services allowed"
  }
};
export interface User {
  username: string;
  password: string;
  role: string;
}

export const users: User[] = [
  { username: 'user1', password: 'user1', role: 'user' },
  { username: 'admin', password: 'admin', role: 'admin' },
];
