import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: AOTPAuthScreen(),
    );
  }
}

class AOTPAuthScreen extends StatefulWidget {
  @override
  _AOTPAuthScreenState createState() => _AOTPAuthScreenState();
}

class _AOTPAuthScreenState extends State<AOTPAuthScreen> {
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController otpController = TextEditingController();
  String generatedOTP = ""; // This will store the received AOTP

  void getAOTP() async {
    // Simulating an API call (Replace this with actual API request)
    setState(() {
      generatedOTP = "ABCD12"; // Mock AOTP
    });
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("AOTP Sent: $generatedOTP")));
  }

  void verifyAOTP() {
    if (otpController.text == generatedOTP) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Login Successful"),
          content: Text("You have successfully logged in!"),
          actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text("OK"))],
        ),
      );
    } else {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text("Invalid OTP"),
          content: Text("Please enter the correct OTP."),
          actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text("Try Again"))],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("AOTP Authentication")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(labelText: "Enter Phone Number"),
            ),
            SizedBox(height: 10),
            ElevatedButton(
              onPressed: getAOTP,
              child: Text("Get AOTP"),
            ),
            SizedBox(height: 20),
            TextField(
              controller: otpController,
              decoration: InputDecoration(labelText: "Enter AOTP"),
            ),
            SizedBox(height: 10),
            ElevatedButton(
              onPressed: verifyAOTP,
              child: Text("Verify AOTP"),
            ),
          ],
        ),
      ),
    );
  }
}
