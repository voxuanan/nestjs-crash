export interface IKafkaAdmin {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  createTopics: (topics: string[]) => Promise<void>;
  getAllTopic: () => Promise<string[]>;
  getAllTopicUnique: () => Promise<string[]>;
  deleteTopics: (topics: string[]) => Promise<boolean>;
}
