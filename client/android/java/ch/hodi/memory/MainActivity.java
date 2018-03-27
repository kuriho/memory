package ch.hodi.memory;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {
    public WebView myWebView = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Bundle extras = getIntent().getExtras();

        String strName = extras.getString("NAME");
        String strGame = extras.getString("GAME");

        myWebView = (WebView) findViewById(R.id.activity_main_webview);

        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        myWebView.loadUrl("file:///android_asset/www/index.html?game=" + strGame + "&name=" + strName);
    }

    @Override
    protected void onDestroy(){
        myWebView.loadUrl("about:blank");
        myWebView.destroy();
        myWebView = null;
        super.onDestroy();
    }
}
