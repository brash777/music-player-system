export interface Node<T> {
  data: T;
  prev: Node<T> | null;
  next: Node<T> | null;
}

export class DoublyLinkedList<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private current: Node<T> | null = null;
  private size: number = 0;

  // ── Helpers ────────────────────────────────────────────────────────────────

  private createNode(data: T): Node<T> {
    return { data, prev: null, next: null };
  }

  private getNodeAt(position: number): Node<T> | null {
    let node = this.head;
    for (let i = 0; i < position; i++) {
      if (node === null) return null;
      node = node.next;
    }
    return node;
  }

  // ── Insertion ──────────────────────────────────────────────────────────────

  addFirst(data: T): void {
    const node = this.createNode(data);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }

    this.size++;
  }

  addLast(data: T): void {
    const node = this.createNode(data);

    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }

    this.size++;
  }

  insertAt(data: T, position: number): void {
    if (position < 0 || position > this.size) {
      throw new Error(
        `Position ${position} is out of bounds. List size is ${this.size}.`
      );
    }

    if (position === 0) {
      this.addFirst(data);
      return;
    }

    if (position === this.size) {
      this.addLast(data);
      return;
    }

    const node = this.createNode(data);
    const before = this.getNodeAt(position - 1) as Node<T>;
    const after = before.next as Node<T>;

    node.prev = before;
    node.next = after;
    before.next = node;
    after.prev = node;

    this.size++;
  }

  // ── Deletion ───────────────────────────────────────────────────────────────

  deleteById(id: string): boolean {
    let node = this.head;

    while (node !== null) {
      if ((node.data as any).id === id) {
        // Unlink from previous
        if (node.prev !== null) {
          node.prev.next = node.next;
        } else {
          // node is head
          this.head = node.next;
        }

        // Unlink from next
        if (node.next !== null) {
          node.next.prev = node.prev;
        } else {
          // node is tail
          this.tail = node.prev;
        }

        // Reset current pointer if it pointed to the deleted node
        if (this.current === node) {
          this.current = node.next ?? node.prev;
        }

        node.prev = null;
        node.next = null;
        this.size--;
        return true;
      }

      node = node.next;
    }

    return false;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  next(): T | null {
    if (this.current === null) {
      // Start from head if no current is set
      this.current = this.head;
      return this.current?.data ?? null;
    }

    if (this.current.next === null) return null;

    this.current = this.current.next;
    return this.current.data;
  }

  prev(): T | null {
    if (this.current === null) {
      // Start from tail if no current is set
      this.current = this.tail;
      return this.current?.data ?? null;
    }

    if (this.current.prev === null) return null;

    this.current = this.current.prev;
    return this.current.data;
  }

  getCurrent(): T | null {
    return this.current?.data ?? null;
  }

  setCurrent(id: string): boolean {
    let node = this.head;

    while (node !== null) {
      if ((node.data as any).id === id) {
        this.current = node;
        return true;
      }
      node = node.next;
    }

    return false;
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  toArray(): T[] {
    const result: T[] = [];
    let node = this.head;

    while (node !== null) {
      result.push(node.data);
      node = node.next;
    }

    return result;
  }

  getSize(): number {
    return this.size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }
}
