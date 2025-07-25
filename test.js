const UIDesignerCLI = require('./ui-designer-cli');

// Test the class initialization
console.log('🧪 Testing UI Designer CLI...\n');

try {
    // Test class instantiation
    const app = new UIDesignerCLI();
    console.log('✅ UIDesignerCLI class instantiated successfully');
    
    // Test interface type mapping
    const testChoices = [1, 2, 3, 4, 5, 6];
    testChoices.forEach(choice => {
        const interfaceType = app.getInterfaceTypeFromChoice(choice);
        console.log(`✅ Choice ${choice} maps to: ${interfaceType}`);
    });
    
    // Test design style mapping
    const testStyles = [1, 2, 3, 4, 5, 6, 7, 8];
    testStyles.forEach(choice => {
        const designStyle = app.getDesignStyleFromChoice(choice);
        console.log(`✅ Style ${choice} maps to: ${designStyle}`);
    });
    
    // Test wireframe generation
    app.projectData = { interfaceType: 'Web Application' };
    const wireframe = app.generateWireframeTemplate();
    console.log('✅ Wireframe template generated successfully');
    
    // Test design recommendations
    const recommendations = app.getDesignRecommendations();
    console.log('✅ Design recommendations generated successfully');
    
    // Test implementation suggestions
    const suggestions = app.getImplementationSuggestions();
    console.log('✅ Implementation suggestions generated successfully');
    
    console.log('\n🎉 All tests passed! The UI Designer CLI is ready to use.');
    console.log('📝 Run "npm start" to launch the interactive CLI.');
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
}
