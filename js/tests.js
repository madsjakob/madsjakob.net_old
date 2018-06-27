

QUnit.test("Render View", function(assert) {
	var result = mjs.renderView("@hest", { "hest": "hest"});
	assert.ok(result === "hest", "Render View Passed");
});
