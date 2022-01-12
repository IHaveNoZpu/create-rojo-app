--// Services \\--
local ReplicatedStorage = game:GetService("ReplicatedStorage")

--// Imports \\--
local Knit = require(ReplicatedStorage:FindFirstChild("Packages"):FindFirstChild("Knit"))

--// Load All Services
Knit.AddServicesDeep(script.Parent.Services)

--// Start Knit
Knit.Start():andThen(function()
	print("Knit Started!")
end):catch(warn)