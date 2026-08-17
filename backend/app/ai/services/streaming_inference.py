from abc import ABC, abstractmethod
from typing import Dict, Any, Callable

class StreamingInferenceInterface(ABC):
    """
    Interface-based Streaming Inference subscriber/publisher architecture.
    Agnostic to underlying message broker (Kafka, RabbitMQ, Azure Event Hubs, AWS Kinesis, Pub/Sub).
    """

    @abstractmethod
    async def subscribe(self, topic: str, handler: Callable[[Dict[str, Any]], None]):
        """Subscribes to an event stream topic."""
        pass

    @abstractmethod
    async def publish_prediction(self, topic: str, payload: Dict[str, Any]):
        """Publishes real-time prediction output event to topic stream."""
        pass


class InMemoryStreamingInference(StreamingInferenceInterface):
    """Event broker implementation for real-time streaming inference testing."""
    def __init__(self):
        self._handlers: Dict[str, List[Callable]] = {}

    async def subscribe(self, topic: str, handler: Callable[[Dict[str, Any]], None]):
        if topic not in self._handlers:
            self._handlers[topic] = []
        self._handlers[topic].append(handler)

    async def publish_prediction(self, topic: str, payload: Dict[str, Any]):
        if topic in self._handlers:
            for handler in self._handlers[topic]:
                handler(payload)

streaming_inference_engine = InMemoryStreamingInference()
