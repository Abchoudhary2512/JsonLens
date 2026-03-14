# JsonLens – JSON Graph Visualizer for VS Code

JsonLens is a platform that helps developers **visualize JSON data as an interactive graph**. Instead of scrolling through large JSON files, you can explore the structure visually, search nodes, and quickly copy JSON paths.

## ✨ Features (v1)

### 🔍 Interactive JSON Graph

Convert JSON files into an interactive graph view.

* Visualize nested objects and arrays
* Expand and collapse nodes
* Zoom and pan across large structures
* Quickly understand complex JSON relationships
 
### 🔎 Search JSON Keys

Quickly find keys in large JSON files.

* Search by key name
* Highlight matching nodes in the graph
* Jump directly to the matching location

### 📍 Copy JSON Path

Click any node to copy its JSON path.

Example output:

```js
users[3].address.city
```

Useful for:

* API debugging
* JavaScript access paths
* Mongo queries

### ⚡ Works Directly Inside VS Code

JsonLens runs inside VS Code using a webview panel.

Open your JSON and visualize instantly.

---

## 🚀 Getting Started

### 1. Open a JSON file

Open any `.json` file in VS Code.

### 2. Launch JsonLens

Run the command:

```
JsonLens: Open JSON Graph
```

or right-click inside the editor and select:

```
Open JSON Graph Viewer
```

### 3. Explore Your JSON

You can now:

* Zoom and pan the graph
* Expand nested objects
* Search for keys
* Copy JSON paths

---

## 🖼 Example

Input JSON:

```json
{
  "users": [
    {
      "id": 1,
      "name": "John",
      "address": {
        "city": "London"
      }
    }
  ]
}
```

JsonLens visualizes it as an interactive graph so you can explore relationships easily.

---

## 🧠 Why JsonLens?

Large JSON files are hard to read in raw format.

JsonLens helps developers:

* Understand JSON structures faster
* Debug API responses
* Explore nested objects visually
* Navigate large datasets easily

---

## 🛠 Built With

* TypeScript
* React
* React Flow
* VS Code Webview API

---

##  Roadmap

Future improvements planned:

* Large JSON streaming support
* JSON diff viewer
* JSON schema detection
* Export graph as PNG / SVG
* Graph layout options
* AI explanation of JSON structures

---

##  Issues & Feedback

If you find bugs or have feature requests, please open an issue in the GitHub repository.

---

