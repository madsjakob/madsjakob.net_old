

QUnit.test("Render View", function(assert) {
	assert.ok("hest" === mjs.renderView("@hest", { "hest": "hest"}), "Render View Passed");
});

QUnit.test("Create Child", function(assert) {
	var parent = document.getElementById("qunit-fixture");
	mjs.createChild(parent, "li");
	assert.ok(parent.childNodes.length === 1);
});
