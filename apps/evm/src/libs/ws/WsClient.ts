export abstract class WsClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnecting = false;
  private readonly activeChannels = new Set<string>();

  constructor(private readonly url: string) {}

  protected openChannel(channel: string): void {
    this.activeChannels.add(channel);
    this.ensureConnected();

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(this.buildSubscribeMessage(channel));
    }
  }

  protected closeChannel(channel: string): void {
    this.activeChannels.delete(channel);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(this.buildUnsubscribeMessage(channel));
    }

    if (this.activeChannels.size === 0) {
      this.disconnect();
    }
  }

  destroy(): void {
    this.activeChannels.clear();
    this.disconnect();
  }

  protected abstract buildSubscribeMessage(channel: string): string;
  protected abstract buildUnsubscribeMessage(channel: string): string;
  protected abstract onMessage(data: string): void;

  private ensureConnected(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.connect();
  }

  private connect(): void {
    this.isConnecting = true;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.isConnecting = false;
      for (const channel of this.activeChannels) {
        this.ws?.send(this.buildSubscribeMessage(channel));
      }
    };

    this.ws.onmessage = ({ data }) => this.onMessage(data as string);
    this.ws.onerror = () => this.ws?.close();

    this.ws.onclose = () => {
      this.isConnecting = false;
      this.ws = null;
      if (this.activeChannels.size > 0) {
        this.scheduleReconnect();
      }
    };
  }

  private disconnect(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.isConnecting = false;
    this.ws?.close();
    this.ws = null;
  }

  private scheduleReconnect(delayMs = 3000): void {
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delayMs);
  }
}
