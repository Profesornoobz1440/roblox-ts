import * as lua from "LuaAST";
import { render, RenderState } from "LuaRenderer";

const UNARY_OPERATOR_MAP = {
	[lua.UnaryOperator.Minus]: "-",
	[lua.UnaryOperator.Not]: "not ",
	[lua.UnaryOperator.Octothorpe]: "#",
};

export function renderUnaryExpression(state: RenderState, node: lua.UnaryExpression) {
	const expStr = render(state, node);
	return `${UNARY_OPERATOR_MAP[node.operator]}${expStr}`;
}
