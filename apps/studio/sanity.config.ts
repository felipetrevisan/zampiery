import { dataset, projectId } from "@nathy/studio/config/env";
import { schema } from "@nathy/studio/schemas";
import structure from "@nathy/studio/structures";
import { visionTool } from "@sanity/vision";
import { type PluginOptions, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import "./styles/globals.css";

if (!projectId || !dataset) {
	throw new Error(
		"Missing SANITY_PROJECT_ID or SANITY_DATASET in your environment",
	);
}

export default defineConfig({
	basePath: "/studio",
	projectId,
	dataset,
	schema,
	title: "Nathy Zampiery",
	//theme,
	studio: {
		components: {
			toolMenu: (props) => {
				const { tools, renderDefault } = props;
				const structureTool = tools.find(({ name }) => name === "structure");
				const otherTools = tools.filter(({ name }) => name !== "structure");

				if (!structureTool) {
					return renderDefault(props);
				}

				return props.renderDefault({
					...props,
					tools: [structureTool, ...otherTools],
				});
			},
		},
	},
	plugins: [
		structureTool({
			structure,
		}),
		// Vision lets you query your content with GROQ in the studio
		// https://www.sanity.io/docs/the-vision-plugin
		process.env.NODE_ENV === "development" &&
			visionTool({ defaultApiVersion: "2024-03-17" }),
	].filter(Boolean) as PluginOptions[],
});
