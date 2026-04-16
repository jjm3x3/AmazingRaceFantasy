---
name: design-system
description: This is the design system skill for the agent.
---

# Design System Skill

## Overview

This skill provides a design system for the agent to use when rendering components. It creates a story for Storybook based on the example.stories.tsx file and documentation based on the docs.mdx file.

## Instructions

1. Create a new stories file for the mentioned React component (such as testComponent.tsx). This should be named in the following format: [component-name].stories.tsx. This file should export a default object with the component's metadata and at least one story that renders the component with some example props.

2. Create a new documentation file for the mentioned React component (such as testComponent.tsx). This documentation file should be named "docs.mdx". This file should include a title, an overview of the component, a list of its props, usage instructions, and a section titled "Example" and Controls block with the component.

## Notes
If the component you are creating a story and documentation for already has a story and documentation, you should error, not overwrite the existing story and documentation, and ask the user to update the existing story and documentation instead. You should provide recommended updates to the existing story and documentation in this case.