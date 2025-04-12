// ------------------------------------------------------------------------------
// >> KUBERNETES EVENT WATCHER
// ------------------------------------------------------------------------------
// * This listens for Kubernetes events and publishes them to a Google Pub/Sub topic

import * as k8s from "@kubernetes/client-node";
import publishToTopic from "../utils/pubsubClient";
import chalk from "chalk";

const topicName = "kubernetes-error-events-oom-crashloop"; // !! Pub/Sub topic name.. testing this one !!

const startK8sEventWatcher = async () => {
  try {
    const kc = new k8s.KubeConfig(); // Load the kubeconfig file
    kc.loadFromDefault(); // uses ~/.kube/config or KUBECONFIG env

    const watch = new k8s.Watch(kc);

    console.log(chalk.bgBlueBright("[K8sWatcher] K8s event watcher started"));

    await watch.watch(
      "/api/v1/events",
      {},
      async (type, obj: any) => {
        const reason = obj.reason || ""; //Extract reason from event object
        const isError =
          obj.type === "Warning" && /Crash|Backoff|OOM/i.test(reason); // Check if the event is a warning and reason matches regex

        if (isError) {
          //   console.log(chalk.yellow(`[K8sWatcher] Detected error: ${obj.type}`));
          const event = {
            reason,
            message: obj.message,
            pod: obj.involvedObject.name,
            namespace: obj.metadata.namespace,
            timestamp: obj.lastTimestamp,
          }; // Create event object

          await publishToTopic(topicName, event, { reason }); // Publish event to Pub/Sub topic
        }
      },
      (err) => {
        throw err;
      }, // Error handling when watching events fails
    );

    console.log(chalk.bgBlueBright("[K8sWatcher] Watching for events"));
  } catch (error) {
    console.error(
      chalk.redBright("[K8sWatcher] Error initializing watcher: "),
      error,
    );
    setTimeout(() => startK8sEventWatcher(), 5000); // Retry after 5 seconds
  }
};

// ------------------------------------------------------------------------------
// >> Module Export
// ------------------------------------------------------------------------------
export default startK8sEventWatcher;
