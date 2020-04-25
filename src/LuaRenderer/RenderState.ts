import * as lua from "LuaAST";

export class RenderState {
	public indent = "";

	private pushIndent() {
		this.indent += "\t";
	}

	private popIndent() {
		this.indent = this.indent.substr(1);
	}

	public block<T>(callback: () => T) {
		this.pushIndent();
		const result = callback();
		this.popIndent();
		return result;
	}

	private scopeStack: Array<Set<string>> = [new Set()];

	private pushScope() {
		this.scopeStack.push(new Set(this.peekScopeStack()));
	}

	private popScope() {
		this.scopeStack.pop();
	}

	private peekScopeStack() {
		return this.scopeStack[this.scopeStack.length - 1];
	}

	private peekScopeStackOrThrow() {
		const result = this.peekScopeStack();
		if (result === undefined) {
			throw "???";
		}
		return result;
	}

	public scope<T>(callback: () => T) {
		this.pushScope();
		const result = this.block(callback);
		this.popScope();
		return result;
	}

	public registerName(name: string) {
		this.peekScopeStackOrThrow().add(name);
	}

	public nameExists(name: string) {
		return this.peekScopeStackOrThrow().has(name);
	}

	private seenTempNodes = new Map<lua.TemporaryIdentifier, string>();

	private getNewTempName(prefix: string) {
		let n = 0;
		let name: string;
		if (prefix.length > 0) {
			prefix = `_${prefix}`;
		}
		do {
			name = `${prefix}_${n++}`;
		} while (this.nameExists(name));
		this.registerName(name);
		return name;
	}

	public getTempName(node: lua.TemporaryIdentifier) {
		const cached = this.seenTempNodes.get(node);
		if (cached !== undefined) {
			return cached;
		}
		const name = this.getNewTempName(node.name);
		this.seenTempNodes.set(node, name);
		return name;
	}
}
