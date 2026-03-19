const RECONNECT_BASE_DELAY_MS = 3_000;
const RECONNECT_MAX_DELAY_MS = 30_000;
const IDLE_DISCONNECT_DELAY_MS = 30_000;

export abstract class WsClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnecting = false;
  private reconnectDelay = RECONNECT_BASE_DELAY_MS;
  private readonly activeChannels = new Set<string>();

  constructor(private readonly url: string) {}

  protected openChannel(channel: string): void {
    this.activeChannels.add(channel);
    this.cancelIdleDisconnect();
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
      this.scheduleIdleDisconnect();
    }
  }

  destroy(): void {
    this.activeChannels.clear();
    this.cancelIdleDisconnect();
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
    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.onopen = () => {
      this.isConnecting = false;
      this.reconnectDelay = RECONNECT_BASE_DELAY_MS;
      for (const channel of this.activeChannels) {
        ws.send(this.buildSubscribeMessage(channel));
      }
    };

    ws.onmessage = ({ data }) => this.onMessage(data as string);
    ws.onerror = () => ws.close();

    ws.onclose = () => {
      if (this.ws !== ws) return;
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

  private scheduleIdleDisconnect(): void {
    this.idleTimer = setTimeout(() => {
      this.idleTimer = null;
      if (this.activeChannels.size === 0) this.disconnect();
    }, IDLE_DISCONNECT_DELAY_MS);
  }

  private cancelIdleDisconnect(): void {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  private scheduleReconnect(): void {
    const delay = this.reconnectDelay;
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, RECONNECT_MAX_DELAY_MS);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }
}
