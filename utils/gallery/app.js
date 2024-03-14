const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function() {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    const models = [
        { name: "BugattiTest", file: "https://github.com/LeafSpark/leafspark.github.io/releases/download/files/bugatti.obj", description: "Description of Model 1" },
        // { name: "Model 2", file: "path/to/model2.obj", description: "Description of Model 2" },
        // Add more models as needed
    ];

    models.forEach((model, index) => {
        BABYLON.SceneLoader.ImportMesh("", "", model.file, scene, function(newMeshes) {
            const mesh = newMeshes[0];
            mesh.position.x = (index - (models.length - 1) / 2) * 5;

            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function() {
                    document.getElementById("infoCard").innerHTML = `<h3>${model.name}</h3><p>${model.description}</p>`;
                })
            );
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function() {
                    document.getElementById("infoCard").innerHTML = "";
                })
            );
        });
    });

    return scene;
};

const scene = createScene();

engine.runRenderLoop(function() {
    scene.render();
});

window.addEventListener("resize", function() {
    engine.resize();
});
